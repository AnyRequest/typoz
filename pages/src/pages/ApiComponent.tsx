import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Typoz from 'typoz';

let loop: number;
let typeNode: any;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

function ApiComponent() {
  const [_wordings, setWordings] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const query = useLocation();
  const [typoz, setTypoz] = useState<Typoz>();
  const [params, setParams] = useState<Record<string, string>>({});
  useEffect(() => {
    const typoz = new Typoz();
    const urlParams = new URLSearchParams(query.search);
    const parameters = Object.fromEntries(urlParams.entries());
    setParams(parameters);
    setTypoz(typoz);
  }, []);

  useEffect(() => {
    typoz?.initialize();
    typoz?.globalConfig();
    if (typoz?.typeNodes[0] && !typeNode) {
      typeNode = typoz?.typeNodes[0];
    }

    return () => {
      typoz?.destroy();
    };
  }, [params]);

  useEffect(() => {
    if (canvasRef.current) {
      canvas = canvasRef.current;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    }
    loop = requestAnimationFrame(render);
    // console.log(
    //   canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'),
    // );
    return () => {
      cancelAnimationFrame(loop);
    };
  }, []);

  function render() {
    loop = requestAnimationFrame(render);
    // const canvas = canvasRef.current;
    const elements = ref.current;
    if (elements) {
      if (typeNode) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        elements.style.top = '0px';
        elements.style.left = '0px';
        setWordings(() => typeNode.element.innerText);
        ctx.font = 'normal 16px sans-serif';
        ctx.fillText(typeNode.element.innerText, 0, 16);
        elements.style.top = '-999999999px';
        elements.style.left = '-999999999px';
      }
    }
  }

  const content = useMemo(() => {
    return (
      <>
        <div
          ref={ref}
          className="typoz"
          style={{
            position: 'absolute',
            zIndex: -1,
            top: '-999999999px',
            left: '-999999999px',
          }}
        >
          {params.word}
        </div>
      </>
    );
  }, [params]);

  return (
    <>
      {content}
      <canvas ref={canvasRef}></canvas>
    </>
  );
}

export default ApiComponent;
