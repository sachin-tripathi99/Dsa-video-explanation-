class Solution {
    public boolean carPooling(int[][] trips, int capacity) {
        for (int x = 0; x <= 1000; x++) {
            int riders = 0;
            for (int[] t : trips) if (t[1] <= x && x < t[2]) riders += t[0];
            if (riders > capacity) return false;
        }
        return true;
    }
}
