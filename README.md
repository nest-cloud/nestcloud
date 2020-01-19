
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud


# NestCloud

<p align="center">
    NestCloud is a <a href="http://nodejs.org" target="blank">Node.js</a> micro-service solution, writing by <a href="https://www.typescriptlang.org" target="blank">Typescript</a> language and <a href="http://nestjs.com/" target="blank">Nest.js</a> framework.</p>
<p align="center">

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
    <a href="https://opencollective.com/nest-cloud#backer"><img src="https://opencollective.com/nest-cloud/backers/badge.svg" alt="Backers on Open Collective" /></a>
    <a href="https://opencollective.com/nest-cloud#sponsor"><img src="https://opencollective.com/nest-cloud/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Install

```shell script
$ npm install @nestcloud/cli -g
```

## NestCloud CLI

```shell script
$ nestcloud --help
Usage: nestcloud <command> [options]

Options:
  -v, --version           Output the current version.
  -h, --help              Output usage information.

Commands:
  new|n [options] [name]  Generate NestCloud application.
  info|i                  Display NestCloud project details.
```

```shell script
$ nestcloud new --help
Usage: nestcloud new|n [options] [name]

Generate NestCloud application.

Options:
  --directory [directory]                  Specify the destination directory
  -d, --dry-run                            Report actions that would be performed without writing out results.
  -g, --skip-git                           Skip git repository initialization.
  -s, --skip-install                       Skip package installation.
  -p, --package-manager [package-manager]  Specify package manager.
  -c, --collection [collectionName]        Schematics collection to use.
  -t, --template [template]                Schematics template to use.
  -h, --help                               Output usage information.
```

## Quick Start

### CLI

```shell script
$ nestcloud new nestcloud-app -t consul-app
$ nestcloud new nestcloud-app -t etcd-app
```

### Starter

[nestcloud-consul-starter](https://github.com/nest-cloud/nestcloud-consul-starter) 

[nestcloud-etcd-starter](https://github.com/nest-cloud/nestcloud-etcd-starter) 

## Examples

[nestcloud-typeorm-example](https://github.com/nest-cloud/nestcloud-typeorm-example)

[nestcloud-grpc-example](https://github.com/nest-cloud/nestcloud-grpc-example)

[nestcloud-kubernetes-example](https://github.com/nest-cloud/nestcloud-kubernetes-example)


## Components

#### [Consul](packages/consul)

Consul module.

#### [Etcd](packages/etcd)

Etcd module.

#### [Kubernetes](packages/kubernetes)

Kubernetes client module.

#### [Boot](packages/boot)

Get local configurations.

#### [Config](packages/config)

Get & watch remote configurations from Consul KV, Etcd or Kubernetes ConfigMap.

#### [Service](packages/service)

Service registration and service discovery

#### [Loadbalance](packages/loadbalance)

Software load balancers primary for rest calls.

#### [Http](packages/http)

A decorator and loadbalance http client.

#### [Grpc](packages/grpc)

A loadbalance grpc client.

#### [Proxy](packages/proxy)

A API proxy module.

#### [Schedule](packages/schedule)

A job scheduler that supports distributed and decorator.

#### [Logger](packages/logger)

Logger module based on winston@2.x

## Who used

<a href="https://www.yanrongyun.com" target="_blank">
    <img src="https://nestcloud.org/_media/who-used/yanrong.svg"/>
</a>

## Stay in touch

- Author - [Miaowing](https://zf.ink)
- Website - [https://nestcloud.org](https://nestcloud.org)

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/nest-cloud/nestcloud/graphs/contributors"><img src="https://opencollective.com/nest-cloud/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/nest-cloud/contribute)]

#### Individuals

<a href="https://opencollective.com/nest-cloud"><img src="https://opencollective.com/nest-cloud/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/nest-cloud/contribute)]

<a href="https://opencollective.com/nest-cloud/organization/0/website"><img src="https://opencollective.com/nest-cloud/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/1/website"><img src="https://opencollective.com/nest-cloud/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/2/website"><img src="https://opencollective.com/nest-cloud/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/3/website"><img src="https://opencollective.com/nest-cloud/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/4/website"><img src="https://opencollective.com/nest-cloud/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/5/website"><img src="https://opencollective.com/nest-cloud/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/6/website"><img src="https://opencollective.com/nest-cloud/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/7/website"><img src="https://opencollective.com/nest-cloud/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/8/website"><img src="https://opencollective.com/nest-cloud/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/9/website"><img src="https://opencollective.com/nest-cloud/organization/9/avatar.svg"></a>

## License

  NestCloud is [MIT licensed](LICENSE).
