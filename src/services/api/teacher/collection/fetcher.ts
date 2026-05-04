import axios from 'axios'

import { filterResources } from './filter'
import type {
  CollectionFetcher,
  PaginationData,
  ResourceApiModel,
  ResourceFilter,
} from '../types/apiType'
import type { Collection, Resource } from '../types/modelType'

const API_URL = 'http://localhost:4000'

class JsonCollectionFetcher implements CollectionFetcher {
  async getCollection(collectionId: string): Promise<Collection> {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    const response = await axios.get<Collection>(
      `${API_URL}/collections/${collectionId}`,
    )
    return response.data
  }

  async getAllCollections(all: boolean): Promise<Array<Collection>> {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    const response = await axios.get<Array<Collection>>(
      `${API_URL}/collections`,
    )
    const data = response.data
    return all ? data : data.slice(0, 3)
  }

  async getResources(
    collectionId: string | undefined,
    searchParams: ResourceFilter,
  ): Promise<PaginationData<Resource>> {
    // await new Promise((resolve) => setTimeout(resolve, 200))
    const response = await axios.get<Array<ResourceApiModel>>(
      `${API_URL}/resources`,
    )
    return filterResources(response.data, collectionId, searchParams)
  }

  async addOrEditCollection(
    name: string,
    role: 'add' | 'edit',
    id?: string,
  ): Promise<void> {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    const data: Collection = {
      id: id || crypto.randomUUID(),
      name,
      filesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sizeMB: 0,
    }
    if (role === 'add') {
      await axios.post('http://localhost:4000/collections', data)
    } else {
      const patch = { name, updatedAt: new Date().toISOString() }
      await axios.patch(`http://localhost:4000/collections/${id}`, patch)
    }
  }

  async deleteCollection(collectionId: string) {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    await axios.delete(`http://localhost:4000/collections/${collectionId}`)
  }
}

export const collectionFetcher: CollectionFetcher = new JsonCollectionFetcher()
