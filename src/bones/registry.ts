import { registerBones } from 'boneyard-js'

type BoneModule = {
  default?: unknown
}

const boneModules = import.meta.glob<BoneModule>('./*.bones.json', {
  eager: true,
})

const registeredBones = Object.fromEntries(
  Object.entries(boneModules).map(([filePath, module]) => {
    const fileName = filePath.split('/').pop() ?? filePath
    const boneName = fileName.replace(/\.bones\.json$/, '')
    const bonePayload = module.default ?? module

    return [boneName, bonePayload]
  }),
)

registerBones(registeredBones as Record<string, any>)
