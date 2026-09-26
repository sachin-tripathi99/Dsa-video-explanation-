class Solution {
    public int[] corpFlightBookings(int[][] bookings, int n) {
        int[] ans = new int[n];
        for (int[] b : bookings)
            for (int f = b[0]; f <= b[1]; f++) ans[f - 1] += b[2];
        return ans;
    }
}
