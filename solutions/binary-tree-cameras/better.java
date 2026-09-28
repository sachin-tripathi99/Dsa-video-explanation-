class Solution {
    private static final int INF = 1_000_000;

    public int minCameraCover(TreeNode root) {
        int[] r = solve(root);
        return Math.min(r[0], r[1]);                        // root must be covered
    }

    // {camera here, covered without camera, not covered (parent must cover)}
    private int[] solve(TreeNode node) {
        if (node == null) return new int[]{INF, 0, 0};
        int[] l = solve(node.left), r = solve(node.right);
        int lmin = Math.min(l[0], Math.min(l[1], l[2])), rmin = Math.min(r[0], Math.min(r[1], r[2]));
        int cam = 1 + lmin + rmin;
        int covered = Math.min(l[0] + Math.min(r[0], r[1]), r[0] + Math.min(l[0], l[1]));
        int open = l[1] + r[1];
        return new int[]{cam, covered, open};
    }
}
