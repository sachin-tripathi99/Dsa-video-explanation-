class Solution {
    public boolean carPooling(int[][] trips, int capacity) {
        int[] d = new int[1001];
        for (int[] t : trips) { d[t[1]] += t[0]; d[t[2]] -= t[0]; }   // board at from, leave at to
        int riders = 0;
        for (int x : d) {
            riders += x;
            if (riders > capacity) return false;
        }
        return true;
    }
}
