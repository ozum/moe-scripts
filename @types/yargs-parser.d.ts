declare module "yargs-parser" {
  export default function parse(args: Array<string>, opts?: object): { [key: string]: any };
}
