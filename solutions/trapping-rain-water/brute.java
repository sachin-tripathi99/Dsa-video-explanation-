class Solution {
    public int trap(int[] height) {
        int n = height.length, total = 0;
        for (int i = 0; i < n; i++) {
            int left = 0, right = 0;
            for (int k = 0; k <= i; k++) left = Math.max(left, height[k]);
            for (int k = i; k < n; k++) right = Math.max(right, height[k]);
            total += Math.min(left, right) - height[i];
        }
        return total;
    }
}
