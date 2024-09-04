import path from 'path';
import fs from 'fs';
import { buildSync } from 'esbuild';

/**
 * This ESBuilder module is used to transpile and bundle .ts files to .cjs file in
 * the 'tmp' folder at the root of the current project directory.
 *
 * PLEASE NOTE: make sure there is a .gitignore file at the root of the
 * current project directory, and add 'tmp' to it.
 */

export class ESBuilder {
  private static tmpDir: string = '';

  // Private constructor to prevent instantiation
  private constructors() {}

  /**
   * Initializes the temporary directory where transpiled files will be placed.
   * Ensures that the directory exists at the root level of the project.
   */
  private static initializeTmpDir(): void {
    if (ESBuilder.tmpDir === '') {
      let rootPath = path.resolve('.gitignore').split('.gitignore')[0];
      ESBuilder.tmpDir = path.join(rootPath, 'tmp');
      // check if the 'tmp' directory exists
      if (!fs.existsSync(ESBuilder.tmpDir)) {
        fs.mkdirSync(ESBuilder.tmpDir);
      }
    }
  }

  /**
   * Transpiles and builds ts files into cjs files.
   * The output files will be placed in the 'tmp' folder.
   *
   * @param files - An array of relative paths of ts files to be transpiled.
   */
  static transpiling(files: string[]): void {
    // make sure the tmp folder exists
    ESBuilder.initializeTmpDir();
    // transpile and build ts files
    files.map((file) => {
      let sourceFilePath = path.resolve(file);
      let tempFilePath = path.join(
        ESBuilder.tmpDir,
        path.basename(sourceFilePath).replace('.ts', '.cjs')
      );
      let buildResult = buildSync({
        platform: 'node',
        bundle: true,
        outfile: tempFilePath,
        entryPoints: [sourceFilePath],
      });
      console.log('build result: ', buildResult);
    });
  }

  /**
   * Finds the path of a built file in the 'tmp' folder.
   *
   * @param filename - The name of the file (no extension needed) to find in the 'tmp' folder.
   * @returns The absolute path to the built file if it exists.
   * @throws Throw an error if the file does not exist.
   */
  static getBuildFilepath(filename: string): string {
    // make sure the tmp folder exists
    ESBuilder.initializeTmpDir();

    let buildFilePath = path.resolve(ESBuilder.tmpDir, `${filename}.cjs`);
    if (fs.existsSync(buildFilePath)) {
      return buildFilePath;
    } else throw new Error(`the path not found: ${buildFilePath}`);
  }
}
