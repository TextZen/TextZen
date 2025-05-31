import { store } from '../lib/store'
import { search, SearchResult } from '../lib/search'

export const handleFullTextSearch = async (
  _,
  query: string,
  caseSensitive?: boolean
): Promise<Array<SearchResult>> => {
  const dir = store.get('general.path') as string
  const results = await search(query, dir, caseSensitive)
  return results
}
