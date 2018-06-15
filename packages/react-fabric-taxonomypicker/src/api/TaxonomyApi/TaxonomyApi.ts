import * as Guid from "uuid/v4";

import { ITerm } from "../../model/ITerm";
import { ITermData } from "./TaxonomyApi.types";

export interface ITaxonomyApiContext {
  absoluteSiteUrl: string;
  termSetId: string;
}

export class TaxonomyApi {
  private static CACHEDATA: {
    [x: string]: ITerm[];
  } = {};

  private spContext: SP.ClientContext;

  constructor(private context: ITaxonomyApiContext) {
    this.spContext = new SP.ClientContext(context.absoluteSiteUrl);
  }

  public async getTerms(noCache: boolean = false): Promise<ITerm[]> {
    const cachedData = TaxonomyApi.CACHEDATA[this.context.termSetId];

    if (cachedData) {
      return cachedData;
    }

    const termData = await this._getTermsInteral();

    // write data to cache
    TaxonomyApi.CACHEDATA[this.context.termSetId] = termData;

    return termData;
  }

  public async findTerms(
    filter: string,
    defaultLabelOnly?: boolean,
    exactMatch?: boolean,
    resultSize: number = 10,
    trimUnavailable?: boolean
  ): Promise<ITerm[]> {
    if (!filter || filter.length === 0) {
      return [];
    }

    const allTerms = await this.getTerms();
    let matchingTerms: ITerm[] = allTerms.filter(term => {
      let isMatch = true;
      if (exactMatch) {
        isMatch = isMatch && term.name === filter;
      } else {
        isMatch = isMatch && new RegExp(filter, "i").test(term.name);
      }
      isMatch = isMatch && (!trimUnavailable || !!term.properties!.isSelectable);

      return isMatch;
    });

    if (matchingTerms.length > resultSize) {
      matchingTerms = matchingTerms.slice(0, resultSize);
    }

    return matchingTerms;
  }

  public async getTermTree(): Promise<{ termSetName: string; terms: ITerm[] }> {
    const taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(this.spContext);
    const termStore = taxonomySession.getDefaultSiteCollectionTermStore();
    const termSet = termStore.getTermSet(new SP.Guid(this.context.termSetId));

    this.spContext.load(termSet);
    await this.awaitableExecuteQuery(this.spContext);

    const terms = await this.getTerms();
    const termData: ITermData[] = terms.map(term => ({
      id: term.id,
      name: term.name,
      path: term.path,
      isSelectable: term.properties!.isSelectable || false,
      parentId: term.properties!.parentId || null,
      children: []
    }));

    const flatData = this._unflatten(termData);

    return {
      termSetName: termSet.get_name(),
      terms: flatData.map(item => this._termDataToTerm(item))
    };
  }

  public async createTerm(name: string, lcid: number = 1033): Promise<ITerm> {
    const taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(this.spContext);
    const termStore = taxonomySession.getDefaultSiteCollectionTermStore();
    const termSet = termStore.getTermSet(new SP.Guid(this.context.termSetId));

    this.spContext.load(termSet);
    await this.awaitableExecuteQuery(this.spContext);

    // Create the term
    const newTerm = termSet.createTerm(name, lcid, Guid());
    this.spContext.load(newTerm);
    await this.awaitableExecuteQuery(this.spContext);

    const newTermInfo: ITerm = {
      id: newTerm.get_id().toString(),
      name: newTerm.get_name(),
      path: newTerm.get_pathOfTerm(),
      properties: {
        isSelectable: true
      }
    };

    // Update the cache
    const cacheData = TaxonomyApi.CACHEDATA[this.context.termSetId];
    if (cacheData) {
      cacheData.push(newTermInfo);
    }
    TaxonomyApi.CACHEDATA[this.context.termSetId] = cacheData;

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

  private async _getTermsInteral(): Promise<ITerm[]> {
    const taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(this.spContext);
    const termStore = taxonomySession.getDefaultSiteCollectionTermStore();
    const termSet = termStore.getTermSet(new SP.Guid(this.context.termSetId));

    const matchingTerms = termSet.getAllTerms();

    this.spContext.load(termSet);
    this.spContext.load(matchingTerms);
    this.spContext.load(matchingTerms, "Include(Parent, Parent.Id)");
    await this.awaitableExecuteQuery(this.spContext);

    const terms: ITerm[] = [];
    const termEnumerator = matchingTerms.getEnumerator();

    while (termEnumerator.moveNext()) {
      const currentTerm = termEnumerator.get_current();

      let parentId: string | null = null;
      if (!currentTerm.get_isRoot()) {
        parentId = currentTerm
          .get_parent()
          .get_id()
          .toString();
      }

      terms.push({
        id: currentTerm.get_id().toString(),
        name: currentTerm.get_name(),
        path: currentTerm.get_pathOfTerm(),
        properties: {
          isSelectable: currentTerm.get_isAvailableForTagging() && !currentTerm.get_isDeprecated(),
          parentId: parentId
        }
      });
    }

    return terms;
  }

  private _termDataToTerm(termData: ITermData) {
    return {
      id: termData.id,
      name: termData.name,
      path: termData.path,
      properties: {
        isSelectable: termData.isSelectable,
        children: termData.children.map(item => this._termDataToTerm(item))
      }
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
          mappedArr[mappedElem.parentId].children.push(mappedElem);
        } else {
          // If the element is at the root level, add it to first level elements array.
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }
}
