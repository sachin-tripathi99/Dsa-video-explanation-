class Solution {
    public int[] corpFlightBookings(int[][] bookings, int n) {
        int[] d = new int[n + 1];
        for (int[] b : bookings) { d[b[0] - 1] += b[2]; d[b[1]] -= b[2]; }
        int[] ans = new int[n];
        int run = 0;
        for (int i = 0; i < n; i++) { run += d[i]; ans[i] = run; }
        return ans;
    }
}
