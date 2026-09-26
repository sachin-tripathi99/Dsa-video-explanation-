class Solution {
    private int best = Integer.MAX_VALUE;

    public int splitArray(int[] nums, int k) {
        go(nums, 0, k, 0);
        return best;
    }

    // Try every end for the current part starting at `start`, with `parts` parts left.
    private void go(int[] a, int start, int parts, int worst) {
        if (start == a.length) { if (parts == 0) best = Math.min(best, worst); return; }
        if (parts == 0) return;
        int s = 0;
        for (int end = start; end < a.length; end++) {
            s += a[end];
            go(a, end + 1, parts - 1, Math.max(worst, s));
        }
    }
}
