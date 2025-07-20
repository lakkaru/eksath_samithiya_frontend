/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })
}

/**
 * @type {import('gatsby').GatsbyNode['onCreatePage']}
 */
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  // Create dynamic pages for expense editing
  if (page.path.match(/^\/account\/edit-expense$/)) {
    page.matchPath = "/account/edit-expense/*"
    createPage(page)
  }
}
