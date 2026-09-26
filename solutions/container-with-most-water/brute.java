class Solution {
    public int maxArea(int[] height) {
        int best = 0;
        for (int l = 0; l < height.length; l++)
            for (int r = l + 1; r < height.length; r++)
                best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
        return best;
    }
}
