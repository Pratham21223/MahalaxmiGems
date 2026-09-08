import { Category } from "../models/Category.js";

function buildTree(cats) {
  const map = new Map(cats.map((c) => [String(c._id), { ...c, children: [] }]));
  const roots = [];
  for (const node of map.values()) {
    if (node.parent && map.has(String(node.parent))) {
      map.get(String(node.parent)).children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sortRec = (nodes) => {
    nodes.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
    nodes.forEach((n) => sortRec(n.children));
    return nodes;
  };
  return sortRec(roots);
}

async function getAncestors(cat) {
  const ancestors = [];
  let current = cat;
  while (current && current.parent) {
    const parent = await Category.findOne({
      _id: current.parent,
      active: true,
    }).lean();
    if (!parent) break;
    ancestors.unshift({ name: parent.name, slug: parent.slug });
    current = parent;
  }
  return ancestors;
}

export async function listCategories(req, res) {
  const cats = await Category.find({ active: true })
    .sort({ order: 1, name: 1 })
    .lean();
  res.json(buildTree(cats));
}

export async function getCategoryBySlug(req, res) {
  const cat = await Category.findOne({
    slug: req.params.slug,
    active: true,
  }).lean();
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const ancestors = await getAncestors(cat);
  res.json({ ...cat, ancestors });
}
