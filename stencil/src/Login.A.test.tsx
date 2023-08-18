import { h } from '@stencil/core'
import { $, expect } from '@wdio/globals'
import { render } from '@wdio/browser-runner/stencil'

import { AppLogin } from './Login.js'

describe('LoginComponent', () => {
    let component: WebdriverIO.Element
    beforeEach(async () => {
        render({
            components: [AppLogin],
            template: () => <app-login />,
            autoApplyChanges: true
        })
        component = await $('>>> .login-dark')
    })

    it('does not log in if input is empty', async () => {
        await component.$('aria/Log In').click()
        await expect(component.$('aria/Email')).toHaveElementClass('is-invalid')
        await expect(component.$('aria/Password')).toHaveElementClass('is-invalid')
    })

    it('failed log in with wrong credentials', async () => {
        await component.$('aria/Email').setValue('invalid@email.com')
        await component.$('aria/Password').setValue('wrong-password')
        await component.$('aria/Log In').click()
        await expect(component.$('aria/Email')).toHaveElementClass('is-invalid')
        await expect(component.$('aria/Password')).toHaveElementClass('is-invalid')
    })

    it('can log in with valid credentials', async () => {
        await component.$('aria/Email').setValue('eve.holt@reqres.in')
        await component.$('aria/Password').setValue('correct-password')
        await component.$('aria/Log In').click()
        await expect(component.$('aria/Email')).not.toHaveElementClass('is-invalid')
        await expect(component.$('aria/Password')).not.toHaveElementClass('is-invalid')
    })
})
