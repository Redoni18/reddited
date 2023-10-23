import React from "react"

export default function Page({ params }: { params: { token: string } }) {
    return <div>My token: {params.token}</div>
}