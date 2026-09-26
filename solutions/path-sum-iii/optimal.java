class Solution {
    private final Map<Long, Integer> seen = new HashMap<>();
    private int count = 0;
    private int target;

    public int pathSum(TreeNode root, int targetSum) {
        target = targetSum;
        seen.put(0L, 1);                                    // empty prefix: paths from the root
        dfs(root, 0L);
        return count;
    }

    private void dfs(TreeNode n, long cur) {
        if (n == null) return;
        cur += n.val;
        count += seen.getOrDefault(cur - target, 0);        // paths ending at n
        seen.merge(cur, 1, Integer::sum);
        dfs(n.left, cur);
        dfs(n.right, cur);
        seen.merge(cur, -1, Integer::sum);                  // leaving this branch
    }
}
