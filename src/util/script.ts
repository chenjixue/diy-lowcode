export interface Defer<T = any> {
  resolve(value?: T | PromiseLike<T>): void;
  reject(reason?: any): void;
  promise(): Promise<T>;
}

export function createDefer<T = any>(): Defer<T> {
  const r: any = {};
  const promise = new Promise<T>((resolve, reject) => {
    r.resolve = resolve;
    r.reject = reject;
  });

  r.promise = () => promise;

  return r;
}

export function load(url: string, scriptType?: string) {
  const node = document.createElement('script');
  
  // node.setAttribute('crossorigin', 'anonymous');

  node.onload = onload;
  node.onerror = onload;

  const i = createDefer();

  function onload(e: any) {
    node.onload = null;
    node.onerror = null;
    if (e.type === 'load') {
      i.resolve();
    } else {
      i.reject();
    }
    // document.head.removeChild(node);
    // node = null;
  }

  node.src = url;

  // `async=false` is required to make sure all js resources execute sequentially.
  node.async = false;

  scriptType && (node.type = scriptType);

  document.head.appendChild(node);

  return i.promise();
}