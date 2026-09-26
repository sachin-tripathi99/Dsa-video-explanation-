class Solution {
    public int trap(int[] height) {
        int n = height.length, total = 0;
        int[] left = new int[n], right = new int[n];
        for (int i = 0; i < n; i++) left[i] = Math.max(i > 0 ? left[i - 1] : 0, height[i]);
        for (int i = n - 1; i >= 0; i--) right[i] = Math.max(i < n - 1 ? right[i + 1] : 0, height[i]);
        for (int i = 0; i < n; i++) total += Math.min(left[i], right[i]) - height[i];
        return total;
    }
}
