import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = "https://publicapi.myoperator.co/chat/phone_numbers"; 
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MYOPERATOR_AUTHENTICATION || process.env.MYOPERATOR_AUTH}`,
        "X-MYOP-COMPANY-ID": process.env.MYOPERATOR_COMPANY_ID,
      },
    });

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      data 
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
