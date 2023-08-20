import { ConfigExtension, GenericConfig } from './types'

/**
 * @param baseConfig Config where other config will be merged into. This object will be mutated.
 * @param configExtension Partial config to merge into the `baseConfig`.
 */
export function mergeConfigs<ClassGroupIds extends string, ThemeGroupIds extends string>(
    baseConfig: GenericConfig,
    {
        cacheSize,
        prefix,
        separator,
        extend = {},
        override = {},
    }: ConfigExtension<ClassGroupIds, ThemeGroupIds>,
) {
    overrideProperty(baseConfig, 'cacheSize', cacheSize)
    overrideProperty(baseConfig, 'prefix', prefix)
    overrideProperty(baseConfig, 'separator', separator)

    for (const configKey in override) {
        overrideConfigProperties(
            baseConfig[configKey as keyof typeof override],
            override[configKey as keyof typeof override],
        )
    }

    for (const key in extend) {
        mergeConfigProperties(
            baseConfig[key as keyof typeof extend],
            extend[key as keyof typeof extend],
        )
    }

    return baseConfig
}

function overrideProperty<T extends object, K extends keyof T>(
    baseObject: T,
    overrideKey: K,
    overrideValue: T[K] | undefined,
) {
    if (overrideValue !== undefined) {
        baseObject[overrideKey] = overrideValue
    }
}

function overrideConfigProperties(
    baseObject: Partial<Record<string, readonly unknown[]>>,
    overrideObject: Partial<Record<string, readonly unknown[]>> | undefined,
) {
    if (overrideObject) {
        for (const key in overrideObject) {
            overrideProperty(baseObject, key, overrideObject[key])
        }
    }
}

function mergeConfigProperties(
    baseObject: Partial<Record<string, readonly unknown[]>>,
    mergeObject: Partial<Record<string, readonly unknown[]>> | undefined,
) {
    if (mergeObject) {
        for (const key in mergeObject) {
            const mergeValue = mergeObject[key]

            if (mergeValue !== undefined) {
                baseObject[key] = (baseObject[key] || []).concat(mergeValue)
            }
        }
    }
}
