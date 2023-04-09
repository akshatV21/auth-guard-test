import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, RequestMethod } from '@nestjs/common'
import { AppModule } from '../../app.module'

describe('@Auth() decorator', () => {
  let app: INestApplication
  const modules: [] = Reflect.getMetadata('imports', AppModule).filter((module: any) => !module.module)

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  describe('test', () => {
    modules.forEach((module: any) => {
      const controllers = Reflect.getMetadata('controllers', module)

      if (controllers.length > 0) {
        for (let i = 0; i < controllers.length; i++) {
          const controller = new controllers[i]()
          const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(controller)).filter(method => method !== 'constructor')

          methods.forEach(method => {
            const path = Reflect.getMetadata('path', controller[method])
            const requestMethod = Reflect.getMetadata('method', controller[method])
            it(`${RequestMethod[requestMethod]} ${
              path[0] === '/' ? path : '/' + path
            } ${method} is not decorated with @Auth() decorator`, () => {
              const authOptions = Reflect.getMetadata('authOptions', controller[method])
              expect(authOptions).toBeDefined()
            })
          })
        }
      }
    })
  })
})
