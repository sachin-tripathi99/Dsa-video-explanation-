class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int n = numbers.length;
        for (int i = 0; i < n; i++) {
            int need = target - numbers[i];
            int lo = i + 1, hi = n - 1;
            while (lo <= hi) {                       // binary search for need
                int mid = lo + (hi - lo) / 2;
                if (numbers[mid] == need) return new int[]{i + 1, mid + 1};
                if (numbers[mid] < need) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return new int[]{-1, -1};
    }
}
