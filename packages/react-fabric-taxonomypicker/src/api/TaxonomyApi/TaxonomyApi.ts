import * as Guid from "uuid/v4";
import { ITerm } from "../../model/ITerm";
import { ITermData } from "./TaxonomyApi.types";

export interface ITaxonomyApiContext {
  absoluteSiteUrl: string;
  termSetId?: string;
  termSetName?: string;
  rootTermId?: string;
}

export class TaxonomyApi {
  private static CACHEDATA: { [x: string]: ITerm[] } = {};

  private spContext: SP.ClientContext;
  private cacheKey: string;

  constructor(private context: ITaxonomyApiContext) {
    this.spContext = new SP.ClientContext(context.absoluteSiteUrl);
    this.cacheKey = this._getCacheKey();
  }

  public async getTerms(
    lcid: number = 1033,
    noCache: boolean = false,
    showTranslatedLabels: boolean = false
  ): Promise<ITerm[]> {
    if (!noCache) {
      const cachedData = TaxonomyApi.CACHEDATA[this.cacheKey];

      if (cachedData) {
        return cachedData;
      }
    }

    const termData = await this._getTermsInteral(lcid, showTranslatedLabels);

    // write data to cache
    if (!noCache) {
      TaxonomyApi.CACHEDATA[this.cacheKey] = termData;
    }

    return termData;
  }

  public async findTerms(
    filter: string,
    lcid: number = 1033,
    defaultLabelOnly?: boolean,
    exactMatch?: boolean,
    showTranslatedLabels?: boolean,
    resultSize?: number,
    trimUnavailable?: boolean,
    trimDeprecated?: boolean
  ): Promise<ITerm[]> {
    if (!filter || filter.length === 0) {
      return [];
    }

    if (!resultSize) {
      resultSize = 10;
    }

    const allTerms = await this.getTerms(lcid, false, showTranslatedLabels);
    let matchingTerms: ITerm[] = allTerms.filter((term) => {
      let isMatch = true;
      if (exactMatch) {
        isMatch =
          isMatch &&
          (term.name === filter ||
            (!defaultLabelOnly && !!term.labels && term.labels.some((l) => l === filter)));
      } else {
        const filterRegexp = new RegExp(filter, "i");

        isMatch =
          isMatch &&
          (filterRegexp.test(term.name) ||
            (!defaultLabelOnly && !!term.labels && term.labels.some((l) => filterRegexp.test(l))));
      }

      isMatch =
        isMatch &&
        (!trimUnavailable || !!term.properties!.isAvailable) &&
        (!trimDeprecated || !term.properties!.isDeprecated);

      return isMatch;
    });

    if (matchingTerms.length > resultSize) {
      matchingTerms = matchingTerms.slice(0, resultSize);
    }

    return matchingTerms;
  }

  public async getTermTree(
    lcid: number = 1033,
    hideDeprecatedTerms?: boolean
  ): Promise<{ termSetName: string; isOpenTermSet: boolean; terms: ITerm[] }> {
    const taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(this.spContext);
    const termStore = taxonomySession.getDefaultSiteCollectionTermStore();
    let termSet: SP.Taxonomy.TermSet;

    if (this.context.termSetName) {
      const termSets = termStore.getTermSetsByName(this.context.termSetName!, lcid);
      this.spContext.load(termSets);
      await this.awaitableExecuteQuery(this.spContext);

      termSet = termSets.itemAt(0);
    } else {
      termSet = termStore.getTermSet(new SP.Guid(this.context.termSetId!));
      this.spContext.load(termSet);
      await this.awaitableExecuteQuery(this.spContext);
    }

    const terms = (await this.getTerms(lcid, false, false)).filter(
      (term) => !hideDeprecatedTerms || !term.properties!.isDeprecated
    );
    const isOpenTermSet = termSet.get_isOpenForTermCreation();
    const termData: ITermData[] = terms.map((term) => ({
      id: term.id,
      name: term.name,
      path: term.path,
      defaultLabel: term.defaultLabel,
      isAvailable: term.properties!.isAvailable || false,
      isDeprecated: term.properties!.isDeprecated || false,
      parentId: term.properties!.parentId || null,
      sortOrder: term.sortOrder,
      children: [],
    }));

    const flatData = this._unflatten(termData);

    return {
      termSetName: termSet.get_name(),
      isOpenTermSet: isOpenTermSet,
      terms: flatData.map((item) => this._termDataToTerm(item)),
    };
  }

  public async createTerm(
    name: string,
    newTermId: Guid,
    lcid: number = 1033,
    parent?: ITerm | null
  ): Promise<ITerm> {
    const taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(this.spContext);
    const termStore = taxonomySession.getDefaultSiteCollectionTermStore();
    let termSet: SP.Taxonomy.TermSet;

    if (this.context.termSetName) {
      const termSets = termStore.getTermSetsByName(this.context.termSetName!, lcid);
      this.spContext.load(termSets);
      await this.awaitableExecuteQuery(this.spContext);

      termSet = termSets.itemAt(0);
    } else {
      termSet = termStore.getTermSet(new SP.Guid(this.context.termSetId!));
      this.spContext.load(termSet);
      await this.awaitableExecuteQuery(this.spContext);
    }

    let term: SP.Taxonomy.Term | null = null;
    let parentTerm: SP.Taxonomy.Term | null = null;

    if (this.context.rootTermId) {
      term = await termSet.getTerm(new SP.Guid(this.context.rootTermId));
    }

    if (parent && parent.id) {
      parentTerm = await termSet.getTerm(new SP.Guid(parent.id));
      this.spContext.load(parentTerm);
    }

    // Create the term
    const newTerm = !parentTerm
      ? !!term
        ? term.createTerm(name, lcid, newTermId)
        : termSet.createTerm(name, lcid, newTermId)
      : parentTerm.createTerm(name, lcid, newTermId);

    this.spContext.load(newTerm);
    await this.awaitableExecuteQuery(this.spContext);

    const newTermInfo: ITerm = {
      id: newTerm.get_id().toString(),
      name: newTerm.get_name(),
      defaultLabel: newTerm.get_name(),
      path: newTerm.get_pathOfTerm(),
      properties: {
        isAvailable: true,
        parentId: !parentTerm
          ? !!term
            ? this.context.rootTermId
            : undefined
          : parentTerm.get_id().toString(),
      },
    };

    // Update the cache in the correct node
    const cacheData = TaxonomyApi.CACHEDATA[this.cacheKey];
    if (cacheData) {
      cacheData.push(newTermInfo);
    }

    TaxonomyApi.CACHEDATA[this.cacheKey] = cacheData;

    return newTermInfo;
  }

  protected awaitableExecuteQuery(context: SP.ClientContext): Promise<void> {
    return new Promise((resolve: any, reject: any) =>
      context.executeQueryAsync(
        () => resolve(),
        (sender: any, args: SP.ClientRequestFailedEventArgs) =>
          reject("Error executing query. Message: " + args.get_message())
      )
    );
  }

  private async _getTermsInteral(
    lcid: number = 1033,
    showTranslatedLabels: boolean = false
  ): Promise<ITerm[]> {
    const taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(this.spContext);
    const termStore = taxonomySession.getDefaultSiteCollectionTermStore();

    let termSet: SP.Taxonomy.TermSet;

    if (this.context.termSetName) {
      const termSets = termStore.getTermSetsByName(this.context.termSetName!, lcid);
      this.spContext.load(termSets);
      await this.awaitableExecuteQuery(this.spContext);

      termSet = termSets.itemAt(0);
    } else {
      termSet = termStore.getTermSet(new SP.Guid(this.context.termSetId!));
      this.spContext.load(termSet);
      await this.awaitableExecuteQuery(this.spContext);
    }

    let rootTerm: SP.Taxonomy.Term | null = null;

    if (!!this.context.rootTermId) {
      rootTerm = termStore.getTermInTermSet(termSet.get_id(), new SP.Guid(this.context.rootTermId));
      this.spContext.load(rootTerm);
    }

    const matchingTerms = termSet.getAllTerms();

    this.spContext.load(matchingTerms);
    this.spContext.load(matchingTerms, "Include(Labels, Parent, Parent.Id, CustomSortOrder)");
    await this.awaitableExecuteQuery(this.spContext);

    const terms: ITerm[] = [];
    const termEnumerator = matchingTerms.getEnumerator();
    const rootTermPath = !!rootTerm ? rootTerm.get_pathOfTerm() : null;

    while (termEnumerator.moveNext()) {
      const currentTerm = termEnumerator.get_current();

      // If there is a root term filled in the web part properties,
      // check if the current term is under it otherwise skip it
      if (rootTermPath && currentTerm.get_pathOfTerm().indexOf(rootTermPath) !== 0) {
        continue;
      }

      let parentId: string | null = null;
      if (!currentTerm.get_isRoot()) {
        parentId = currentTerm.get_parent().get_id().toString();
      }

      const termLabels = currentTerm.get_labels();
      let termLabel: string = currentTerm.get_name();

      if (showTranslatedLabels) {
        const termLabelByLcid = currentTerm.getDefaultLabel(lcid);
        const termLabelEn = currentTerm.getDefaultLabel(1033);

        await this.awaitableExecuteQuery(this.spContext);

        termLabel = termLabelByLcid ? termLabelByLcid.get_value() : termLabelEn.get_value();
      }
      const labels: string[] = [];
      const labelsEnumerator = termLabels.getEnumerator();
      while (labelsEnumerator.moveNext()) {
        const label = labelsEnumerator.get_current();
        labels.push(label.get_value());
      }

      terms.push({
        id: currentTerm.get_id().toString(),
        sortOrder: currentTerm.get_customSortOrder(),
        name: currentTerm.get_name(),
        defaultLabel: termLabel,
        labels: labels,
        path: currentTerm.get_pathOfTerm(),
        properties: {
          isAvailable: currentTerm.get_isAvailableForTagging(),
          isDeprecated: currentTerm.get_isDeprecated(),
          parentId: parentId,
        },
      });
    }

    return terms;
  }

  private _getCacheKey(): string {
    const termSetPart = this.context.termSetName || this.context.termSetId!;

    return !!this.context.rootTermId ? `${termSetPart}_${this.context.rootTermId}` : termSetPart;
  }

  private _termDataToTerm(termData: ITermData): ITerm {
    return {
      id: termData.id,
      name: termData.name,
      path: termData.path,
      defaultLabel: termData.defaultLabel,
      properties: {
        isAvailable: termData.isAvailable,
        isDeprecated: termData.isDeprecated,
        children: termData.children.map((item) => this._termDataToTerm(item)),
      },
    };
  }

  private _unflatten(arr: ITermData[]) {
    const tree: ITermData[] = [];
    const mappedArr = {};
    let arrElem: ITermData;
    let mappedElem: ITermData;

    // First map the nodes of the array to an object -> create a hash table.
    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.id!] = arrElem;
      if (!mappedArr[arrElem.id!].properties) {
        mappedArr[arrElem.id!].properties = {};
      }
      mappedArr[arrElem.id!].properties.children = [];
    }

    for (const id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parentId) {
          if (mappedArr[mappedElem.parentId]) {
            mappedArr[mappedElem.parentId].children.push(mappedElem);
          }
        } else {
          // If the element is at the root level, add it to first level elements array.
          tree.push(mappedElem);
        }
      }
    }

    // Next iteration -> sort the entire tree
    return this._sortTree(tree);
  }

  private _sortTree(tree: ITermData[]) {
    for (let i = 0; i < tree.length; i++) {
      tree[i] = this._sortTermAndChildren(tree[i]);
    }
    return tree;
  }

  private _sortTermAndChildren(term: ITermData): ITermData {
    if (term.children.length && term.sortOrder) {
      // If not null, the custom sort order is a string of GUIDs, delimited by a :
      if (term.sortOrder) {
        const sortOrderSplit = term.sortOrder.split(":");

        term.children.sort((a, b) => {
          if (!!a.id && !!b.id) {
            const indexA = sortOrderSplit.indexOf(a.id);
            const indexB = sortOrderSplit.indexOf(b.id);

            if (indexA > indexB) {
              return 1;
            } else if (indexA < indexB) {
              return -1;
            }

            return 0;
          }

          return 0;
        });
      } else {
        // If null, terms are just sorted alphabetically
        term.children.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          } else if (a.name < b.name) {
            return -1;
          }

          return 0;
        });
      }
    }

    for (let i = 0; i < term.children.length; i++) {
      term.children[i] = this._sortTermAndChildren(term.children[i]);
    }

    return term;
  }
}
