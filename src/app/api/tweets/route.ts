// /api/tweets
import { NextRequest, NextResponse } from 'next/server';

enum TweetAction {
  POST_TWEET = 'post_tweet',
  LIKE_TWEET = 'like_tweet',
  REPLY_TO_TWEET = 'reply_to_tweet',
}

interface TweetResponse {
  data: any;
  action: TweetAction;
  created_at: string;
}

interface Tweet {
  id: string;
  action: TweetAction;
  created_at: string;
  text?: string;
}

// In-memory store for tweets (to replace with database)
const tweets: Tweet[] = [
  {
    id: '1',
    text: "> Look at these raccoons strutting their stuff. They know they're gorgeous. And yes, I made them that way. You're welcome.",
    created_at: '2011-10-10T14:48:00',
    action: TweetAction.POST_TWEET,
  },
];

// Handle GET requests to serve posts to the terminal
export async function GET(req: NextRequest) {
  return NextResponse.json(tweets);
}

// Handle POST requests to add posts to the in-memory store
export async function POST(req: NextRequest) {
  try {
    const tweetResponse: TweetResponse = await req.json();

    let tweet: Tweet;

    switch (tweetResponse.action) {
      case TweetAction.POST_TWEET:
        tweet = {
          id: tweetResponse.data.id,
          text: tweetResponse.data.text,
          created_at: tweetResponse.created_at,
          action: tweetResponse.action,
        };
        break;
      case TweetAction.LIKE_TWEET:
        tweet = {
          id: tweetResponse.data.id,
          text: '> Liked tweet.',
          created_at: tweetResponse.created_at,
          action: tweetResponse.action,
        };
        break;
      case TweetAction.REPLY_TO_TWEET:
        tweet = {
          id: tweetResponse.data.id,
          text: '> Replied to tweet.',
          created_at: tweetResponse.created_at,
          action: tweetResponse.action,
        };
        break;
    }

    tweets.push(tweet);
    return NextResponse.json(
      { message: 'Post received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error receiving post:', error);
    return NextResponse.json(
      { error: 'Failed to receive post' },
      { status: 500 }
    );
  }
}
