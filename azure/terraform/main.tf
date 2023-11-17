provider "azurerm" {
  features {}
}

resource "random_id" "deployment_name" {
  byte_length = 4
}

resource "azurerm_resource_group" "rg" {
  name     = "${random_id.deployment_name.hex}-example"
  location = "West US"
}

resource "azurerm_storage_account" "storage_account" {
  name                     = "${random_id.deployment_name.hex}function"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "storage_container" {
  name                  = "app"
  storage_account_name  = azurerm_storage_account.storage_account.name
  container_access_type = "private"
}

resource "azurerm_service_plan" "service_plan" {
  name                = "${random_id.deployment_name.hex}-app-service-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "function" {
  name                = "${random_id.deployment_name.hex}-linux-function-app"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE"    = "https://${azurerm_storage_account.storage_account.name}.blob.core.windows.net/${azurerm_storage_container.storage_container.name}/${azurerm_storage_blob.storage_blob.name}${data.azurerm_storage_account_blob_container_sas.storage_account_blob_container_sas.sas}",
    "FUNCTIONS_WORKER_RUNTIME" = "node",
    "AzureWebJobsDisableHomepage" = "true",
  }

  storage_account_name       = azurerm_storage_account.storage_account.name
  storage_account_access_key = azurerm_storage_account.storage_account.primary_access_key
  service_plan_id            = azurerm_service_plan.service_plan.id

  site_config {}
}

data "archive_file" "zip" {
  type        = "zip"
  source_dir  = "../src"
  output_path = "function.zip"
}

resource "azurerm_storage_blob" "storage_blob" {
  name = "${filesha256(data.archive_file.zip.output_path)}.zip"
  storage_account_name = azurerm_storage_account.storage_account.name
  storage_container_name = azurerm_storage_container.storage_container.name
  type = "Block"
  source = data.archive_file.zip.output_path
}

data "azurerm_storage_account_blob_container_sas" "storage_account_blob_container_sas" {
  connection_string = azurerm_storage_account.storage_account.primary_connection_string
  container_name    = azurerm_storage_container.storage_container.name

  start = "2021-01-01T00:00:00Z"
  expiry = "2026-01-01T00:00:00Z"

  permissions {
    read   = true
    add    = false
    create = false
    write  = false
    delete = false
    list   = false
  }
}