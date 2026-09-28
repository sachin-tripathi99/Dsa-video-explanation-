class Solution {
    int depth, parent;
    void find(TreeNode* n, int target, int d, int p) {
        if (!n) return;
        if (n->val == target) { depth = d; parent = p; return; }
        find(n->left, target, d + 1, n->val);
        find(n->right, target, d + 1, n->val);
    }
public:
    bool isCousins(TreeNode* root, int x, int y) {
        find(root, x, 0, -1);
        int dx = depth, px = parent;
        find(root, y, 0, -1);                               // second full search
        return dx == depth && px != parent;
    }
};
