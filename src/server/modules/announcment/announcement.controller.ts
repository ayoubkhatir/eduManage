import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import type {
  AnnouncementModel,
  CreateAnnouncementModel,
  EditAnnouncementModel,
} from '#/schemas/announcement.schemas'

interface AnnouncementSearchType {
  search?: string
}

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dbPath = join(__dirname, '../../dataBase/db.json')

interface DbData {
  announcements: AnnouncementModel[]
  [key: string]: any
}

// Helper function to read db.json
async function readDb(): Promise<DbData> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading db.json:', error)
    return { announcements: [] }
  }
}

// Helper function to write db.json
async function writeDb(data: DbData): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing db.json:', error)
  }
}

class AnnouncementsController {
  async listAnnouncements(search_queries: AnnouncementSearchType) {
    try {
      const db = await readDb()
      let announcements = db.announcements

      // Filter by search term if provided
      if (search_queries.search) {
        const searchTerm = search_queries.search.toLowerCase()
        announcements = announcements.filter(
          (ann) =>
            ann.title.toLowerCase().includes(searchTerm) ||
            ann.content.toLowerCase().includes(searchTerm) ||
            ann.authorName.toLowerCase().includes(searchTerm),
        )
      }

      return {
        data: announcements,
        pagination: {
          totalCount: announcements.length,
          totalPages: 1,
        },
      }
    } catch (error) {
      throw error
    }
  }

  async getAnnouncement(announcementId: string) {
    try {
      const db = await readDb()
      const announcement = db.announcements.find(
        (ann) => ann.id === announcementId,
      )

      if (!announcement) throw new Error('Announcement not found')
      return announcement
    } catch (error) {
      throw error
    }
  }

  async addAnnouncement(data: CreateAnnouncementModel) {
    try {
      const db = await readDb()
      const newAnnouncement: AnnouncementModel = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        publishedAt: new Date().toISOString(),
        isRead: false,
      }

      db.announcements.push(newAnnouncement)
      await writeDb(db)
      return newAnnouncement
    } catch (error) {
      throw error
    }
  }

  async editAnnouncement(announcementId: string, data: EditAnnouncementModel) {
    try {
      const db = await readDb()
      const index = db.announcements.findIndex(
        (ann) => ann.id === announcementId,
      )
      if (index === -1) throw new Error('Announcement not found')

      const updatedAnnouncement: AnnouncementModel = {
        id: announcementId,
        ...data,
      }

      db.announcements[index] = updatedAnnouncement
      await writeDb(db)
      return updatedAnnouncement
    } catch (error) {
      throw error
    }
  }

  async deleteAnnouncement(announcementId: string) {
    try {
      const db = await readDb()
      const index = db.announcements.findIndex(
        (ann) => ann.id === announcementId,
      )
      if (index === -1) throw new Error('Announcement not found')

      db.announcements.splice(index, 1)
      await writeDb(db)
      return { success: true, message: 'Announcement deleted successfully' }
    } catch (error) {
      throw error
    }
  }
}

export const announcementsController = new AnnouncementsController()
