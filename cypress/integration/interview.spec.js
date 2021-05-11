/// <reference types="cypress"/>

describe('my login test', () => {
    beforeEach('login in to app', () => {
        cy.login('reward_admin@dashboard.com', 'reward_admin')
    })

    it('verify user Authorities for reward', () => {


        const userCredentails = {
            "email": "reward_admin@dashboard.com",
            "password": "reward_admin"
        }

        cy.request('POST', 'https://api.perxtech.io/v4/dash/user_sessions', userCredentails)
            .its('body').then(body => {
                const token = body.bearer_token
                cy.request({
                    url: 'https://api.perxtech.io/v4/dash/authorizations',
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + token }


                }).then(Response => {
                    expect(Response.status).to.equal(200)
                })
                    .its('body').then(body => {
                        expect(body.data.permissions[0].resource_name).to.equal('rewards')
                        expect(body.data.permissions[0].actions[0]).to.equal('view')
                        expect(body.data.permissions[0].actions[1]).to.equal('edit')
                        expect(body.data.permissions[0].actions[2]).to.equal('activate')
                        expect(body.data.permissions[0].actions[3]).to.equal('deactivate')
                    })
                    cy.contains('button', 'Create New').should('be.enabled')
                // cy.request({
                //     url:'https://api.perxtech.io/v4/dash/campaigns',
                //     method: 'GET',
                //     headers: {'Authorization': 'Bearer ' + token }
                // }).then( Response =>{
                //     expect(Response.status).to.equal(403)
                // })

            })

    })

    it('Creating a reward', () => {
        cy.contains('button', 'Create New').click()
        cy.location('pathname').should('contain', '/dashboard/p/rewards/create');


        cy.get('.ant-form-item-control').find('[type="radio"]').then(radioButtons => {
            cy.wrap(radioButtons)
                .eq(1)
                .check({ force: true })
                .should('be.checked')
        })
         const rewardtext = 'interviewtesting'
        cy.get('[placeholder="Type in your reward name here"]').type(rewardtext)
        cy.contains('button', 'Next').click()
        cy.contains('.ant-form-item-control', 'Start Date').find('[placeholder="Select date"]').invoke('val').should('not.be.empty')

        cy.contains('.ant-form-item-control', 'End Date').find('[placeholder="Select date"]').then(input => {
            cy.wrap(input).click()
            cy.get('.ant-calendar-body').contains('17').click()
            cy.wrap(input).invoke('prop', 'value').should('not.be.empty')

        })  

        cy.contains('button', 'Next').click()
        cy.get('[type="submit"]').click()
        cy.get('[data-key="rewards"]').click()

        cy.get('.ant-table-body').should('be.visible')
        cy.get('input[placeholder="Search reward by name and merchant"]').type(rewardtext)
        cy.get('tbody').should('contain',rewardtext)
        cy.get('tbody').contains('tr',rewardtext).then( tablerow =>{
            cy.wrap(tablerow).find('a').click()
        })
       cy.contains('div','Reward Info').find('[data-testid="type"]').should('contain','Private')
       cy.contains('div','Reward Info').find('[data-testid="categories"]').should('contain','N.A')
       cy.contains('div','Reward Info').find('[data-testid="brand_name"]').should('contain','N.A')
       cy.contains('div','Reward Info').find('[data-testid="tags"]').should('contain','N.A')
       cy.contains('div','Reward Info').find('[data-testid="labels"]').should('contain','N.A')



      


    })
})