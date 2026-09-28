class Solution {
    const int INF = 1000000;
    array<int, 3> solve(TreeNode* node) {                   // {camera here, covered w/o camera, not covered}
        if (!node) return {INF, 0, 0};
        auto l = solve(node->left), r = solve(node->right);
        int cam = 1 + min({l[0], l[1], l[2]}) + min({r[0], r[1], r[2]});
        int covered = min(l[0] + min(r[0], r[1]), r[0] + min(l[0], l[1]));
        int open = l[1] + r[1];
        return {cam, covered, open};
    }
public:
    int minCameraCover(TreeNode* root) {
        auto c = solve(root);
        return min(c[0], c[1]);                             // root must be covered
    }
};
