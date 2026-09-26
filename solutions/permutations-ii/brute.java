class Solution {
    private final Set<List<Integer>> seen = new LinkedHashSet<>();

    public List<List<Integer>> permuteUnique(int[] nums) {
        go(nums, new boolean[nums.length], new ArrayList<>());
        return new ArrayList<>(seen);
    }

    private void go(int[] nums, boolean[] used, List<Integer> path) {
        if (path.size() == nums.length) { seen.add(new ArrayList<>(path)); return; }   // set drops duplicates
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true; path.add(nums[i]);
            go(nums, used, path);
            path.remove(path.size() - 1); used[i] = false;
        }
    }
}
