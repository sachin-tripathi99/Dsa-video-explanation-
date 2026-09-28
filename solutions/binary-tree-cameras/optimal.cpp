class Solution {
    int cameras = 0;
    int state(TreeNode* node) {                             // 0 needs cover, 1 camera, 2 covered
        if (!node) return 2;
        int l = state(node->left), r = state(node->right);
        if (l == 0 || r == 0) { cameras++; return 1; }      // a child needs us
        if (l == 1 || r == 1) return 2;                     // a child's camera covers us
        return 0;
    }
public:
    int minCameraCover(TreeNode* root) {
        if (state(root) == 0) cameras++;                    // root still uncovered
        return cameras;
    }
};
