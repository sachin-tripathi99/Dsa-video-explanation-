class BSTIterator {
    vector<int> vals;
    size_t i = 0;
    void inorder(TreeNode* n) {
        if (!n) return;
        inorder(n->left);
        vals.push_back(n->val);
        inorder(n->right);
    }
public:
    BSTIterator(TreeNode* root) { inorder(root); }          // flatten up front
    int next() { return vals[i++]; }
    bool hasNext() { return i < vals.size(); }
};
