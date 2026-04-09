'use client'

import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  crashed: boolean
}

export default class CopyButtonErrorBoundary extends Component<Props, State> {
  state: State = { crashed: false }

  static getDerivedStateFromError(): State {
    return { crashed: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[CopyButton] Render error caught by boundary:', error, info)
  }

  reset = () => this.setState({ crashed: false })

  render() {
    if (this.state.crashed) {
      return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-800">
                Something went wrong while loading the copy button.
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Your signature may still have been copied to the clipboard — try pasting
                it into Outlook with{' '}
                <kbd className="bg-amber-100 border border-amber-300 rounded px-1 py-0.5 font-mono text-[10px]">
                  Ctrl+V
                </kbd>
                . If it didn&apos;t work, click retry below.
              </p>
            </div>
          </div>
          <button
            onClick={this.reset}
            className="flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
