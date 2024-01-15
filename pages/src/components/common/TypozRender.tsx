import { useEffect, useRef } from 'react';
import Typoz, { OmitNodesOptions, Options, RecursivePartial } from 'typoz';

type BaseProcess = {
  speed?: number;
  value?: string | number | boolean;
};

interface ProcessStringValue extends BaseProcess {
  action: 'write';
  value: string;
}
interface ProcessNumberValue extends BaseProcess {
  action: 'erase' | 'move' | 'pause';
  value: number;
}
interface ProcessNoneValue extends BaseProcess {
  action: 'allErase' | 'run';
}
interface ProcessBooleanValue extends BaseProcess {
  action: 'forever';
  value?: boolean;
}

type PropcessType =
  | ProcessStringValue
  | ProcessNumberValue
  | ProcessNoneValue
  | ProcessBooleanValue;

type BaseTypozRenderProps = {
  id?: string;
  className?: string;
  words?: string[];
  builder?: boolean;
  children?: string;
  processes?: PropcessType[];
  globalConfig?: Options;
  config?: RecursivePartial<OmitNodesOptions>;
};

interface TypozRenderNormalProps extends BaseTypozRenderProps {
  id?: string;
  className?: string;
  words?: string[];
  config?: RecursivePartial<OmitNodesOptions>;
  children?: string;
}
interface TypozRenderBuilderProps extends BaseTypozRenderProps {
  id: string;
  builder: boolean;
  config?: RecursivePartial<OmitNodesOptions>;
  processes: PropcessType[];
}

type TypozRenderProps = TypozRenderNormalProps | TypozRenderBuilderProps;

function TypozRender({
  children,
  words,
  id,
  className,
  builder = false,
  processes = [],
  globalConfig,
  config,
  ...props
}: TypozRenderProps) {
  const typoz = new Typoz();
  const typingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typingRef.current) {
      if (builder === true) {
        handleTypeBuilderProcess(typoz, processes);
      } else {
        handleTypeNodeRender(typoz);
      }
    }
    return () => {
      typoz.destroy();
    };
  }, []);

  function handleTypeBuilderProcess(typoz: Typoz, processes: PropcessType[]) {
    const typeBuilder = typoz
      .node()
      .select('#' + id)
      .config(config || {});
    for (const { action, value, speed } of processes) {
      switch (action) {
        case 'write':
          if (speed) typeBuilder.write(value, speed);
          else typeBuilder.write(value);
          break;
        case 'erase':
          if (speed) typeBuilder.erase(value, speed);
          else typeBuilder.erase(value);
          break;
        case 'move':
          if (speed) typeBuilder.move(value, speed);
          else typeBuilder.move(value);
          break;
        case 'pause':
          typeBuilder.pause(value);
          break;
        case 'allErase':
          typeBuilder.allErase();
          break;
        case 'run':
          typeBuilder.run();
          break;
        case 'forever':
          typeBuilder.forever(value ?? false);
          break;
      }
    }
  }

  function handleTypeNodeRender(typoz: Typoz) {
    typoz.initialize();
    typoz.globalConfig({
      ...globalConfig,
      nodes: [
        {
          select: id ? '#' + id : '.' + className,
          words: words || [],
          config,
        },
      ],
    });
  }

  return (
    <div ref={typingRef} id={id} className={className} {...props}>
      {children}
    </div>
  );
}

export default TypozRender;
