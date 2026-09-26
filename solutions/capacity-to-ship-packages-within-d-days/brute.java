class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int cap = 0;
        for (int w : weights) cap = Math.max(cap, w);
        while (daysNeeded(weights, cap) > days) cap++;
        return cap;
    }

    private int daysNeeded(int[] w, int cap) {
        int d = 1, load = 0;
        for (int x : w) {
            if (load + x > cap) { d++; load = 0; }
            load += x;
        }
        return d;
    }
}
