import { RESOURCE_LABELS } from '../constants/labels'
import { useCharacter } from '../state/characterContext'
import { resourceMax, resourceValue } from '../lib/rules'
import { Stepper } from './ui'
import type { ResourceKey } from '../types/resources'

export function ResourceControls({ resources }: { resources: readonly ResourceKey[] }) {
  const { character, dispatch } = useCharacter()
  return (
    <div className="resource-controls">
      {resources.map((resource) => (
        <Stepper
          key={resource}
          label={RESOURCE_LABELS[resource]}
          value={resourceValue(character, resource)}
          min={0}
          max={resourceMax(character, resource)}
          suffix={`/ ${resourceMax(character, resource)}`}
          onChange={(value) => dispatch({ type: 'resource', resource, value })}
        />
      ))}
    </div>
  )
}
