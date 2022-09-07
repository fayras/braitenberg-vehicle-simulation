import React from 'react';
import { Icon as ChakraIcon, IconProps } from '@chakra-ui/react';

// Die svg paths stammen von "https://heroicons.dev/".

function Icon(props: IconProps): React.ReactElement {
  return <ChakraIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" w={6} h={6} {...props} />;
}

export function PlayIcon(props: IconProps): React.ReactElement {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Icon>
  );
}

export function PauseIcon(props: IconProps): React.ReactElement {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </Icon>
  );
}

export function RewindIcon(props: IconProps): React.ReactElement {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
      />
    </Icon>
  );
}

export function BookmarkIcon(props: IconProps): React.ReactElement {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </Icon>
  );
}

export function MenuIcon(props: IconProps): React.ReactElement {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </Icon>
  );
}

export function DownIcon(props: IconProps): React.ReactElement {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </Icon>
  );
}

export function RightIcon(props: IconProps): React.ReactElement {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </Icon>
  );
}

export function DoubleRightIcon(props: IconProps): React.ReactElement {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </Icon>
  );
}

export function DoubleLeftIcon(props: IconProps): React.ReactElement {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </Icon>
  );
}

export function PlusIcon(props: IconProps): React.ReactElement {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </Icon>
  );
}

export function TrashIcon(props: IconProps): React.ReactElement {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </Icon>
  );
}
