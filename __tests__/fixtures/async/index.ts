import { foo } from './foo';
import { bar } from './bar';

Promise.all([foo(), bar()]).then(([foo, bar]) => {
  console.warn(foo, bar);
});
