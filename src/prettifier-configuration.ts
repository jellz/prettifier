import ignore from 'ignore'
import prettier from 'prettier'
import { Context } from 'probot'
import { loadBotConfig } from 'probot-kit'

// Encapsulates logic around configuration of Prettifier
export class PrettifierConfiguration {
  static defaults = {
    excludeBranches: [],
    excludeFiles: ['node_modules']
  }

  // Loads the configuration for the current session from the server
  static async load(context: Context): Promise<PrettifierConfiguration> {
    const actualConfig = await loadBotConfig('.github/prettifier.yml', context)
    return new PrettifierConfiguration(actualConfig)
  }

  // names of the branches that should not be prettified
  excludeBranches: string[]

  // names of files that should not be prettified
  excludeFiles: string[]

  // Creates a new configuration based on the given config object.
  // Missing values are backfilled with default values.
  constructor(actualConfig: any) {
    this.excludeBranches =
      actualConfig.excludeBranches ||
      PrettifierConfiguration.defaults.excludeBranches
    this.excludeFiles =
      actualConfig.excludeFiles || PrettifierConfiguration.defaults.excludeFiles
  }

  // Indicates whether the given branch should be ignored
  shouldIgnoreBranch(branchName: string): boolean {
    return this.excludeBranches.includes(branchName)
  }

  // Indicates whether the given file should be prettified
  async shouldPrettify(filename: string) {
    // check whether the filename is listed as ignored
    if (
      ignore()
        .add(this.excludeFiles)
        .ignores(filename)
    ) {
      return false
    }

    // check whether Prettifier thinks it can handle the file
    try {
      const result = await prettier.getFileInfo(filename)
      return !result.ignored
    } catch (e) {
      return false
    }
  }
}
