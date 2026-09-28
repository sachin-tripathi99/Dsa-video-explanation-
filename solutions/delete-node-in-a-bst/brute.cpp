class Solution {
    vector<int> vals;
    void collect(TreeNode* n, int key) {                    // sorted, without key
        if (!n) return;
        collect(n->left, key);
        if (n->val != key) vals.push_back(n->val);
        collect(n->right, key);
    }
    TreeNode* build(int lo, int hi) {
        if (lo > hi) return nullptr;
        int m = (lo + hi) / 2;
        TreeNode* root = new TreeNode(vals[m]);
        root->left = build(lo, m - 1);
        root->right = build(m + 1, hi);
        return root;
    }
public:
    TreeNode* deleteNode(TreeNode* root, int key) {
        collect(root, key);
        return build(0, (int)vals.size() - 1);
    }
};
