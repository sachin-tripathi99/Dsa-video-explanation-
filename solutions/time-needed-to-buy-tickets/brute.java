class Solution {
    public int timeRequiredToBuy(int[] tickets, int k) {
        Deque<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < tickets.length; i++) q.offer(new int[]{i, tickets[i]});
        int time = 0;
        while (true) {
            int[] p = q.poll();
            time++;
            p[1]--;                                      // buy one ticket
            if (p[0] == k && p[1] == 0) return time;
            if (p[1] > 0) q.offer(p);                    // back of the line
        }
    }
}
