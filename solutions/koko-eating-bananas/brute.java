class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        for (int k = 1; ; k++) {
            long hours = 0;
            for (int p : piles) hours += (p + k - 1) / k;
            if (hours <= h) return k;
        }
    }
}
