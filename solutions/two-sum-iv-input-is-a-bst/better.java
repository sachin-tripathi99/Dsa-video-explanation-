class Solution {
    private final Set<Integer> seen = new HashSet<>();

    public boolean findTarget(TreeNode root, int k) {
        if (root == null) return false;
        if (seen.contains(k - root.val)) return true;       // partner seen earlier
        seen.add(root.val);
        return findTarget(root.left, k) || findTarget(root.right, k);
    }
}
