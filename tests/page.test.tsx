import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import Page from '../src/app/zendesk/sidebar/page'
import { ZendeskProvider } from "@/hooks/use-zendesk"

jest.mock("../src/lib/auth", () => {
    return {

    }
})

describe('SidebarPage', () => {
  it('renders', () => {
    render(
      <ZendeskProvider>
        <Page />
      </ZendeskProvider>
    )
  })
})