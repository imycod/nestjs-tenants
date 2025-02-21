import { glob } from 'glob';
import * as path from 'path';

export function filterEntities(baseDir: string, exclude: string[] = []): string[] {
  const allEntities = glob.sync(path.join(baseDir, '**/*.postsql.entity.{ts,js}'));
  return allEntities.filter(entity => 
    !exclude.some(excludePath => entity.includes(excludePath))
  );
}