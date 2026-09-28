class Solution {
    public List<Integer> countSmaller(int[] nums) {
        int n = nums.length;
        int[] vals = Arrays.stream(nums).distinct().sorted().toArray();   // rank = index + 1
        int[] tree = new int[vals.length + 1];
        Integer[] res = new Integer[n];
        for (int i = n - 1; i >= 0; i--) {
            int r = Arrays.binarySearch(vals, nums[i]) + 1;
            int c = 0;
            for (int x = r - 1; x > 0; x -= x & -x) c += tree[x];   // seen values with smaller rank
            res[i] = c;
            for (int x = r; x < tree.length; x += x & -x) tree[x]++; // record this value
        }
        return Arrays.asList(res);
    }
}
