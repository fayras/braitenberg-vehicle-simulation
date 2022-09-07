import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Box, FormLabel } from '@chakra-ui/react';
import { RenderableAttribute } from '../../components/attributes/RenderableAttribute';
import { store as selectedEntityStore } from '../_store/selectedEntity';
import { ComponentType } from '../../enums';
import { ComponentId } from '../../components/ECSComponent';

type Props = {
  attribute: RenderableAttribute<ConnectionComponentData>;
  label: string;
};

export const ConnectionNetwork = observer((props: Props): JSX.Element => {
  const [selectedSensor, selectSensor] = useState<ComponentId | null>(null);
  const entity = selectedEntityStore.selectedEntity;
  const sensors = entity?.getComponents(ComponentType.SENSOR);
  const motors = entity?.getComponents(ComponentType.MOTOR);

  if (!sensors || !motors) {
    return <div>Es können keine Verbindungen geschaffen werden.</div>;
  }

  const sensorOffset = 100 / sensors.length / 2;
  const motorOffset = 100 / motors.length / 2;
  const radius = 7;
  return (
    <div>
      <Box mb="2.5">
        <FormLabel color="gray.800" fontSize="sm" mb="0">
          {props.label}
        </FormLabel>
      </Box>
      <motion.svg width="100%" height={50 + 2 * radius}>
        {props.attribute.value.map((pair) => {
          const sensorIndex = sensors.findIndex((s) => s.id === pair.input);
          const motorIndex = motors.findIndex((m) => m.id === pair.output);

          return (
            <motion.line
              key={`${pair.input}_${pair.output}`}
              stroke="black"
              x1={`${(sensorIndex / sensors.length) * 100 + sensorOffset}%`}
              y1={radius}
              x2={`${(motorIndex / motors.length) * 100 + motorOffset}%`}
              y2={50 + radius}
            />
          );
        })}
        {sensors.map((s, index) => (
          <motion.circle
            key={s.id}
            cx={`${(index / sensors.length) * 100 + sensorOffset}%`}
            cy={radius}
            r={radius}
            cursor="pointer"
            onClick={() => selectSensor(s.id)}
          />
        ))}
        {motors.map((m, index) => (
          <motion.circle
            key={m.id}
            fill={selectedSensor ? 'red' : 'black'}
            cx={`${(index / motors.length) * 100 + motorOffset}%`}
            cy={50 + radius}
            r={radius}
            onClick={() => {
              if (!selectedSensor) {
                return;
              }

              const currentPairs = props.attribute.value;
              const exists = currentPairs.find((pair) => pair.input === selectedSensor && pair.output === m.id);
              if (!exists) {
                props.attribute.value = [...currentPairs, { input: selectedSensor, output: m.id, weight: 1 }];
              }

              selectSensor(null);
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
});
