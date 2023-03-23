import { html, render } from 'lit'
import { expect, $ } from '@wdio/globals'
import { fn, mocked, mock } from '@wdio/browser-runner'

import { login } from './api.js'
import './Login'

mock('./api.js', () => ({
    login: fn()
}))

describe('LoginComponent with mocked API', () => {
    let component: WebdriverIO.Element

    before(async () => {
        render(
            html`<app-login />`,
            document.body
        )
        component = await $('>>> .login-dark')
    })

    it('does not log in if input is empty', async () => {
        await component.$('aria/Log In').click()
        await expect(component.$('aria/Email')).toHaveElementClass('is-invalid')
        await expect(component.$('aria/Password')).toHaveElementClass('is-invalid')
    })

    it('failed log in with wrong credentials', async () => {
        mocked(login).mockResolvedValue({ error: 'Invalid credentials' })

        await component.$('aria/Email').setValue('invalid@email.com')
        await component.$('aria/Password').setValue('wrong-password')
        await component.$('aria/Log In').click()
        await expect(component.$('aria/Email')).toHaveElementClass('is-invalid')
        await expect(component.$('aria/Password')).toHaveElementClass('is-invalid')
    })

    it('can log in with valid credentials', async () => {
        mocked(login).mockResolvedValue({ name: 'eve' })

        await component.$('aria/Email').setValue('eve.holt@reqres.in')
        await component.$('aria/Password').setValue('correct-password')
        await component.$('aria/Log In').click()
        await expect(component.$('aria/Email')).not.toHaveElementClass('is-invalid')
        await expect(component.$('aria/Password')).not.toHaveElementClass('is-invalid')
    })
})