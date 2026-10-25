import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Glyph from '@repo/nothing-glyph';

import {
  TPNothingGlyphDeviceNames,
  TPNothingGlyphSegmentCount,
} from '@/services/third-party/nothing/glyph-defs.ts';
import { Logger } from '@/utils/logger.ts';

interface IContextValue {
  isOpen?: boolean;
}

const Context = createContext<IContextValue | null>(null);

export function TPNothingGlyphProvider(props: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);

  const logger = useMemo(
    () => Logger.for('Thirdparty.NothingGlyphProvider'),
    [],
  );

  useEffect(() => {
    if (isOpen || !Glyph?.isSupported()) return;

    logger.info('Opening proxy');
    Glyph.open()
      .then(() => {
        logger.info('Proxy open');
        setIsOpen(true);
      })
      .catch((e) => logger.error('Failed to open proxy', e));
  }, [isOpen, logger]);

  return (
    <Context.Provider value={{ isOpen }}>{props.children}</Context.Provider>
  );
}

export function useTPNothingGlyph() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Must be used inside NothingGlyphProvider');

  return {
    isOpen: ctx.isOpen,
    isSupported: Glyph?.isSupported(),
    deviceName:
      TPNothingGlyphDeviceNames[
        (Glyph?.deviceName() as keyof typeof TPNothingGlyphDeviceNames) ??
          'NULL'
      ],
    segments: {
      count:
        TPNothingGlyphSegmentCount[
          (Glyph?.deviceName() as keyof typeof TPNothingGlyphSegmentCount) ??
            'NULL'
        ],
    },
    toggle: Glyph?.toggle,
    animate: Glyph?.animate,
    turnOff: Glyph?.turnOff,
    displayProgress: Glyph?.displayProgress,
  };
}
